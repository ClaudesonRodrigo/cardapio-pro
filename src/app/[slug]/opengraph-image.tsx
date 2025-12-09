// src/app/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getPageDataBySlug, PageData } from '@/lib/pageService';

export const runtime = 'edge';

export const alt = 'Cardápio Digital';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // No Next.js 15, params é uma Promise e precisa de await
  const { slug } = await params;
  
  const pageData = await getPageDataBySlug(slug) as PageData | null;

  const title = pageData?.title || 'Cardápio Digital';
  const bio = pageData?.bio || 'Faça seu pedido online!';
  const profileImage = pageData?.profileImageUrl;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          // Fundo escuro elegante (padrão gourmet)
          background: '#121212', 
          color: 'white',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Elemento decorativo de fundo (mancha laranja) */}
        <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
        }}></div>

        {profileImage ? (
          // Se tiver logo, mostra ela redonda e destacada
          <img
            src={profileImage}
            alt={title}
            width="200"
            height="200"
            style={{
              borderRadius: '50%',
              border: '8px solid #ea580c', // Borda laranja
              objectFit: 'cover',
              marginBottom: '40px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}
          />
        ) : (
          // Se não tiver logo, mostra um ícone de prato (círculo laranja)
          <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              fontSize: '80px',
              color: 'white',
              fontWeight: 'bold'
          }}>
             {title.charAt(0).toUpperCase()}
          </div>
        )}

        <div style={{ 
            fontSize: 70, 
            fontWeight: 900, 
            marginBottom: '10px',
            background: 'linear-gradient(to right, #fff, #ccc)',
            backgroundClip: 'text',
            color: 'transparent',
            maxWidth: '1000px',
            padding: '0 20px',
            lineHeight: 1.1
        }}>
          {title}
        </div>

        <div style={{ 
            fontSize: 32, 
            color: '#a3a3a3', 
            maxWidth: '900px', 
            lineHeight: 1.4,
            marginBottom: '40px'
        }}>
          {bio.length > 80 ? bio.substring(0, 80) + '...' : bio}
        </div>

        {/* Badge de Call to Action */}
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ea580c', 
            padding: '15px 40px', 
            borderRadius: '50px',
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)'
        }}>
            Ver Cardápio Completo
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}