// src/layouts/StandaloneLayout.jsx
export default function StandaloneLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto p-4 sm:p-8">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left panel (optional brand/time) */}
          <section className="hidden lg:flex relative items-center justify-center p-6">
            <div className="absolute inset-6 rounded-3xl bg-emerald-600/10 blur-[70px] pointer-events-none" />
            <div className="relative z-10 max-w-lg">
              <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                ហាងឱសថ បញ្ញារិទ្ធ
              </h1>
              <p className="mt-4 text-lg text-gray-700/80 dark:text-gray-300">
                ទំព័រលក់ឯករាជ្យ ស្អាត និងឆាប់រហ័ស។
              </p>
            </div>
          </section>

          {/* Right panel (card) */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-3xl rounded-3xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 p-6 sm:p-8">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
