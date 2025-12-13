// src/lib/pageService.ts

import {
  doc, getDoc, updateDoc, arrayUnion, arrayRemove, DocumentData,
  collection, query, where, getDocs, orderBy, limit
} from "firebase/firestore";
import { db } from "./firebaseClient";

export type LinkData = {
  title: string;
  url?: string;
  type: string; 
  order: number;
  icon?: string;
  clicks?: number;
  price?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
};

export type PageData = {
  title: string;
  bio: string;
  address?: string;
  whatsapp?: string;
  pixKey?: string;
  profileImageUrl?: string;
  backgroundImage?: string;
  links: LinkData[];
  theme?: string;
  userId: string;
  slug: string;
  plan?: string; // O plano agora vive aqui também!
  isOpen?: boolean;
  createdAt?: any;
};

export type UserData = {
  plan: string;
  pageSlug: string;
  displayName?: string;
  email?: string;
  role?: string;
};

// --- Funções de Leitura ---

export const getRecentPages = async (): Promise<PageData[]> => {
  try {
    const pagesRef = collection(db, "pages");
    const q = query(pagesRef, orderBy("createdAt", "desc"), limit(4)); 
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PageData);
  } catch (error) {
    console.error("Erro ao buscar cardápios recentes:", error);
    return [];
  }
};

export const getPageDataForUser = async (userId: string): Promise<{ slug: string, data: DocumentData } | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) return null;

    const userData = userDocSnap.data();
    const pageSlug = userData?.pageSlug;
    
    if (!pageSlug) {
      const pagesRef = collection(db, "pages");
      const q = query(pagesRef, where("userId", "==", userId));
      const pagesSnap = await getDocs(q);
      if (!pagesSnap.empty) {
        const pageDoc = pagesSnap.docs[0];
        // Sincroniza o plano do usuário com a página na leitura do admin
        return { slug: pageDoc.id, data: { ...pageDoc.data(), plan: userData?.plan || 'free' } };
      }
      return null;
    }

    const pageDocRef = doc(db, "pages", pageSlug);
    const pageDocSnap = await getDoc(pageDocRef);

    if (pageDocSnap.exists()) {
       // Sincroniza o plano
       return { slug: pageSlug, data: { ...pageDocSnap.data(), plan: userData?.plan || 'free' } };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
};

export const getPageDataBySlug = async (slug: string): Promise<DocumentData | null> => {
  try {
    const pageDocRef = doc(db, "pages", slug);
    const pageDocSnap = await getDoc(pageDocRef);
    
    if (!pageDocSnap.exists()) return null;

    const pageData = pageDocSnap.data();

    // CORREÇÃO: Não tentamos mais ler o 'users' aqui, pois visitantes não têm permissão.
    // Confiamos no campo 'plan' que agora está salvo dentro de 'pages' (via updateUserPlan).
    // Se não tiver 'plan' na página, assume 'free'.
    return { ...pageData, plan: pageData.plan || 'free' }; 

  } catch (error) {
    console.error("Erro ao carregar slug:", error);
    return null;
  }
};

// --- Funções de Escrita ---

export const addLinkToPage = async (pageSlug: string, newLink: LinkData): Promise<void> => {
  const pageDocRef = doc(db, "pages", pageSlug);
  await updateDoc(pageDocRef, { links: arrayUnion(newLink) });
};

export const deleteLinkFromPage = async (pageSlug: string, linkToDelete: LinkData): Promise<void> => {
  const pageDocRef = doc(db, "pages", pageSlug);
  await updateDoc(pageDocRef, { links: arrayRemove(linkToDelete) });
};

export const updateLinksOnPage = async (pageSlug: string, updatedLinks: LinkData[]): Promise<void> => {
  const pageDocRef = doc(db, "pages", pageSlug);
  await updateDoc(pageDocRef, { links: updatedLinks });
};

export const updatePageTheme = async (pageSlug: string, theme: string): Promise<void> => {
  await updateDoc(doc(db, "pages", pageSlug), { theme });
};

export const updatePageBackground = async (pageSlug: string, imageUrl: string): Promise<void> => {
  await updateDoc(doc(db, "pages", pageSlug), { backgroundImage: imageUrl });
};

export const updateProfileImage = async (pageSlug: string, imageUrl: string): Promise<void> => {
  await updateDoc(doc(db, "pages", pageSlug), { profileImageUrl: imageUrl });
};

export const updatePageProfileInfo = async (
    pageSlug: string, 
    title: string, 
    bio: string, 
    address: string, 
    isOpen: boolean, 
    whatsapp: string, 
    pixKey: string
): Promise<void> => {
  const dataToUpdate = { title, bio, address, isOpen, whatsapp, pixKey: pixKey || "" };
  await updateDoc(doc(db, "pages", pageSlug), dataToUpdate);
};

export const incrementLinkClick = async (pageSlug: string, itemId: string): Promise<void> => {
  try {
    const pageDocRef = doc(db, "pages", pageSlug);
    // Incremento de clique não precisa ler a página toda, otimização futura.
    // Por enquanto mantemos a lógica segura.
    const pageSnap = await getDoc(pageDocRef);
    if (pageSnap.exists()) {
      const pageData = pageSnap.data() as PageData;
      const links = pageData.links || [];
      const linkIndex = links.findIndex(l => l.title === itemId || l.url === itemId);
      if (linkIndex !== -1) {
        const updatedLinks = [...links];
        updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], clicks: (updatedLinks[linkIndex].clicks || 0) + 1 };
        await updateDoc(pageDocRef, { links: updatedLinks });
      }
    }
  } catch (error) { console.error(error); }
};

export const findUserByEmail = async (email: string): Promise<(UserData & { uid: string }) | null> => {
  if (!email) return null;
  // NOTA: Para isso funcionar, as regras do Firestore devem permitir que usuários logados leiam a coleção 'users'.
  const q = query(collection(db, "users"), where("email", "==", email.trim()));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { uid: snapshot.docs[0].id, ...(snapshot.docs[0].data() as UserData) };
};

// CORREÇÃO CRÍTICA: Atualiza o plano no USER e na PÁGINA
export const updateUserPlan = async (userId: string, newPlan: 'free' | 'pro'): Promise<void> => {
  // 1. Atualiza no User (Referência oficial)
  await updateDoc(doc(db, "users", userId), { plan: newPlan });

  // 2. Busca a página desse usuário para atualizar lá também
  // (Isso permite que o cardápio público saiba que é PRO sem consultar o user privado)
  const pagesRef = collection(db, "pages");
  const q = query(pagesRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
      const pageId = snapshot.docs[0].id;
      await updateDoc(doc(db, "pages", pageId), { plan: newPlan });
  }
};