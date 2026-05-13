'use client'

export function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Zemin: Slate 50 */}
      <div className="absolute inset-0" style={{ background: '#f8fafc' }} />

      {/* Blob 1 — Soft Blue (mavi ışık sızıntısı, sol üst) */}
      <div
        className="absolute rounded-full"
        style={{
          width: '900px', height: '900px',
          background: 'radial-gradient(circle, #bfdbfe 0%, #93c5fd 30%, transparent 70%)',
          top: '-20%', left: '10%',
          opacity: 0.45,
          filter: 'blur(100px)',
          animation: 'mesh-drift-1 20s ease-in-out infinite',
        }}
      />

      {/* Blob 2 — Soft Pink (pembe ışık sızıntısı, sağ üst) */}
      <div
        className="absolute rounded-full"
        style={{
          width: '750px', height: '750px',
          background: 'radial-gradient(circle, #fbcfe8 0%, #f9a8d4 30%, transparent 70%)',
          top: '-10%', right: '-5%',
          opacity: 0.40,
          filter: 'blur(110px)',
          animation: 'mesh-drift-2 25s ease-in-out infinite',
        }}
      />

      {/* Blob 3 — Mint Green (yeşil ışık sızıntısı, sol alt) */}
      <div
        className="absolute rounded-full"
        style={{
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, #a7f3d0 0%, #6ee7b7 30%, transparent 70%)',
          bottom: '-15%', left: '-5%',
          opacity: 0.35,
          filter: 'blur(90px)',
          animation: 'mesh-drift-3 28s ease-in-out infinite',
        }}
      />

      {/* Blob 4 — Lavender (lavanta, sağ alt — bütünleyici) */}
      <div
        className="absolute rounded-full"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, #ddd6fe 0%, #c4b5fd 30%, transparent 70%)',
          bottom: '5%', right: '10%',
          opacity: 0.35,
          filter: 'blur(100px)',
          animation: 'mesh-drift-1 32s ease-in-out infinite reverse',
        }}
      />

      {/* Blob 5 — Peach (şeftali, merkez — yumuşak ısı) */}
      <div
        className="absolute rounded-full"
        style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, #fed7aa 0%, #fdba74 25%, transparent 65%)',
          top: '40%', left: '40%',
          opacity: 0.20,
          filter: 'blur(120px)',
          animation: 'mesh-drift-2 36s ease-in-out infinite reverse',
        }}
      />
    </div>
  )
}
