// src/lib/pageService.ts

import {
  doc, getDoc, updateDoc, arrayUnion, arrayRemove, DocumentData,
  collection, query, where, getDocs
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
  profileImageUrl?: string;
  backgroundImage?: string;
  links: LinkData[];
  theme?: string;
  userId: string;
  slug: string;
  plan?: string; // NOVO: Vamos passar o plano para o front
};

export type UserData = {
  plan: string;
  pageSlug: string;
  displayName?: string;
  email?: string;
  role?: string;
};

// --- Funções de Leitura ---

export const getPageDataForUser = async (userId: string): Promise<{ slug: string, data: DocumentData } | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) return null;

    const userData = userDocSnap.data();
    const pageSlug = userData?.pageSlug;
    
    if (!pageSlug) {
      // Fallback
      const pagesRef = collection(db, "pages");
      const q = query(pagesRef, where("userId", "==", userId));
      const pagesSnap = await getDocs(q);
      if (!pagesSnap.empty) {
        const pageDoc = pagesSnap.docs[0];
        // Injetamos o plano nos dados da página para facilitar o controle no front
        return { slug: pageDoc.id, data: { ...pageDoc.data(), plan: userData?.plan || 'free' } };
      }
      return null;
    }

    const pageDocRef = doc(db, "pages", pageSlug);
    const pageDocSnap = await getDoc(pageDocRef);

    if (pageDocSnap.exists()) {
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

    // Precisamos buscar o usuário dono dessa página para saber o plano dele
    // Isso garante que se ele deixar de pagar, o recurso some da página pública
    if (pageData.userId) {
        const userDocRef = doc(db, "users", pageData.userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return { ...pageData, plan: userDocSnap.data().plan || 'free' };
        }
    }

    return { ...pageData, plan: 'free' }; // Default se não achar user
  } catch (error) {
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

export const updatePageProfileInfo = async (pageSlug: string, title: string, bio: string, address: string): Promise<void> => {
  await updateDoc(doc(db, "pages", pageSlug), { title, bio, address });
};

// --- Outras Funções ---

export const incrementLinkClick = async (pageSlug: string, itemId: string): Promise<void> => {
  try {
    const pageDocRef = doc(db, "pages", pageSlug);
    const pageSnap = await getDoc(pageDocRef);

    if (pageSnap.exists()) {
      const pageData = pageSnap.data() as PageData;
      const links = pageData.links || [];
      const linkIndex = links.findIndex(l => l.title === itemId || l.url === itemId);

      if (linkIndex !== -1) {
        const updatedLinks = [...links];
        const currentClicks = updatedLinks[linkIndex].clicks || 0;
        updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], clicks: currentClicks + 1 };
        await updateDoc(pageDocRef, { links: updatedLinks });
      }
    }
  } catch (error) { console.error(error); }
};

export const generateVCardBlob = (pageData: PageData): Blob => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${pageData.title}
ORG:${pageData.title}
NOTE:${pageData.bio}
URL:${typeof window !== 'undefined' ? window.location.href : ''}
END:VCARD`;
  return new Blob([vcard], { type: "text/vcard;charset=utf-8" });
};

export const findUserByEmail = async (email: string): Promise<(UserData & { uid: string }) | null> => {
  if (!email) return null;
  const q = query(collection(db, "users"), where("email", "==", email.trim()));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { uid: snapshot.docs[0].id, ...(snapshot.docs[0].data() as UserData) };
};

export const updateUserPlan = async (userId: string, newPlan: 'free' | 'pro'): Promise<void> => {
  await updateDoc(doc(db, "users", userId), { plan: newPlan });
};