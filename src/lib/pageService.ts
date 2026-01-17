// src/lib/pageService.ts

import {
  doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, deleteDoc, DocumentData,
  collection, query, where, getDocs, orderBy, limit, Timestamp, onSnapshot
} from "firebase/firestore";
import { db } from "./firebaseClient";

// --- TIPOS ---
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

export type CouponData = {
  code: string;       
  type: 'percent' | 'fixed'; 
  value: number;      
  minValue?: number;  
  active: boolean;    
};

export type OrderStatus = 'pending' | 'preparing' | 'delivery' | 'completed' | 'canceled';

export type OrderData = {
  id?: string;
  pageSlug: string;
  customerId?: string; 
  customerName: string;
  customerPhone?: string;
  deliveryMethod: 'delivery' | 'pickup'; 
  deliveryAddress?: string; 
  items: any[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: any;
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
  coupons?: CouponData[]; 
  theme?: string;
  customThemeColor?: string;
  userId: string;
  slug: string;
  plan?: string;
  trialDeadline?: Timestamp;
  isOpen?: boolean;
  createdAt?: any;
};

export type UserData = {
  plan: string;
  pageSlug: string;
  displayName?: string;
  email?: string;
  role?: string;
  trialDeadline?: any; 
  cpfCnpj?: string;   
  phone?: string;     
  createdAt?: any;    
};

// --- FUNÇÃO AUXILIAR ---
const checkPlanValidity = (data: any) => {
    if (!data) return 'free';
    if (data.plan === 'pro' && data.trialDeadline) {
        const now = new Date();
        const deadline = data.trialDeadline.toDate();
        if (now > deadline) return 'free'; 
    }
    return data.plan || 'free';
};

// --- FUNÇÕES DE PEDIDOS ---

export const createOrder = async (order: OrderData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
};

export const getOrdersBySlug = async (slug: string): Promise<OrderData[]> => {
  try {
    const q = query(
      collection(db, "orders"), 
      where("pageSlug", "==", slug),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<OrderData | null> => {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as OrderData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<void> => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status: newStatus });
};

export const getOrdersByCustomerId = async (customerId: string): Promise<OrderData[]> => {
  try {
    const q = query(
      collection(db, "orders"), 
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
};

export const getOrdersByDateRange = async (slug: string, startDate: Date, endDate: Date): Promise<OrderData[]> => {
  try {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const start = new Date(`${startStr}T00:00:00`);
    const end = new Date(`${endStr}T23:59:59`);

    const q = query(
      collection(db, "orders"), 
      where("pageSlug", "==", slug),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));

  } catch (error: any) {
    console.error("ERRO NO FILTRO FINANCEIRO:", error);
    if (error.code === 'failed-precondition') {
        alert("⚠️ ATENÇÃO DEV: Falta criar o índice no Firebase! Olhe o Console (F12) e clique no link.");
        console.log("%c CLIQUE NESTE LINK PARA CRIAR O ÍNDICE: ", "background: red; color: white; font-size: 20px");
    }
    return [];
  }
};


// --- FUNÇÕES DE LEITURA (PÁGINAS) ---

export const getRecentPages = async (): Promise<PageData[]> => {
  try {
    const pagesRef = collection(db, "pages");
    const q = query(pagesRef, orderBy("createdAt", "desc"), limit(4)); 
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PageData);
  } catch (error) {
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
        const pageData = pageDoc.data();
        const sourceOfData = userData?.plan ? userData : pageData;
        const realPlan = checkPlanValidity(sourceOfData); 
        return { slug: pageDoc.id, data: { ...pageData, plan: realPlan } };
      }
      return null;
    }

    const pageDocRef = doc(db, "pages", pageSlug);
    const pageDocSnap = await getDoc(pageDocRef);

    if (pageDocSnap.exists()) {
       const pageData = pageDocSnap.data();
       const sourceOfData = userData?.plan ? userData : pageData;
       const realPlan = checkPlanValidity(sourceOfData);
       return { slug: pageSlug, data: { ...pageData, plan: realPlan } };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getPageDataBySlug = async (slug: string): Promise<DocumentData | null> => {
  try {
    const pageDocRef = doc(db, "pages", slug);
    const pageDocSnap = await getDoc(pageDocRef);
    if (!pageDocSnap.exists()) return null;

    const pageData = pageDocSnap.data();
    const realPlan = checkPlanValidity(pageData);
    return { ...pageData, plan: realPlan }; 
  } catch (error) { return null; }
};

export const getAllUsers = async (): Promise<(UserData & { uid: string, createdAt?: any })[]> => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...(doc.data() as UserData)
    }));
  } catch (error) {
    return [];
  }
};

// --- ESCRITA ---

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

export const updatePageCoupons = async (pageSlug: string, coupons: CouponData[]): Promise<void> => {
  const pageDocRef = doc(db, "pages", pageSlug);
  await updateDoc(pageDocRef, { coupons });
};

export const updatePageTheme = async (pageSlug: string, theme: string, customColor?: string): Promise<void> => {
  const updateData: any = { theme };
  if (customColor) {
    updateData.customThemeColor = customColor;
  }
  await updateDoc(doc(db, "pages", pageSlug), updateData);
};

export const updatePageBackground = async (pageSlug: string, imageUrl: string): Promise<void> => {
  await updateDoc(doc(db, "pages", pageSlug), { backgroundImage: imageUrl });
};

export const updateProfileImage = async (pageSlug: string, imageUrl: string): Promise<void> => {
  await updateDoc(doc(db, "pages", pageSlug), { profileImageUrl: imageUrl });
};

export const updatePageProfileInfo = async (
    pageSlug: string, title: string, bio: string, address: string, 
    isOpen: boolean, whatsapp: string, pixKey: string
): Promise<void> => {
  const dataToUpdate = { title, bio, address, isOpen, whatsapp, pixKey: pixKey || "" };
  await updateDoc(doc(db, "pages", pageSlug), dataToUpdate);
};

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
        updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], clicks: (updatedLinks[linkIndex].clicks || 0) + 1 };
        await updateDoc(pageDocRef, { links: updatedLinks });
      }
    }
  } catch (error) { console.error(error); }
};

export const findUserByEmail = async (email: string): Promise<(UserData & { uid: string }) | null> => {
  if (!email) return null;
  const q = query(collection(db, "users"), where("email", "==", email.trim()));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { uid: snapshot.docs[0].id, ...(snapshot.docs[0].data() as UserData) };
};

// --- FUNÇÕES ADMIN (NOVAS) ---

// Atualiza Plano (User e Page)
export const updateUserPlan = async (userId: string, newPlan: 'free' | 'pro'): Promise<void> => {
  try {
      await updateDoc(doc(db, "users", userId), { plan: newPlan, trialDeadline: null });
      const pagesRef = collection(db, "pages");
      const q = query(pagesRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
          const updates = snapshot.docs.map(pageDoc => updateDoc(doc(db, "pages", pageDoc.id), { plan: newPlan, trialDeadline: null }));
          await Promise.all(updates);
      }
  } catch (error) {
      console.error("Erro ao atualizar plano no Firebase:", error);
      throw error;
  }
};

export const updateUserFiscalData = async (userId: string, cpfCnpj: string, phone: string): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { cpfCnpj, phone });
};

// Edição Simples de Usuário (Nome/Slug) - Admin
export const adminUpdateUser = async (userId: string, newName: string): Promise<void> => {
    // Nota: Alterar Slug é complexo pois é o ID do documento. Por segurança, só alteramos o Nome aqui.
    await updateDoc(doc(db, "users", userId), { displayName: newName });
};

// Deletar Usuário e sua Página do Banco de Dados
export const adminDeleteUserSystem = async (userId: string, pageSlug?: string): Promise<void> => {
    try {
        // 1. Deleta o doc de Usuário
        await deleteDoc(doc(db, "users", userId));
        
        // 2. Se tiver página, deleta a página
        if (pageSlug) {
            await deleteDoc(doc(db, "pages", pageSlug));
        } else {
            // Tenta achar a página se não foi passada
            const pagesRef = collection(db, "pages");
            const q = query(pagesRef, where("userId", "==", userId));
            const snapshot = await getDocs(q);
            if(!snapshot.empty) {
                await deleteDoc(doc(db, "pages", snapshot.docs[0].id));
            }
        }
    } catch (error) {
        console.error("Erro ao deletar usuário do sistema:", error);
        throw error;
    }
};