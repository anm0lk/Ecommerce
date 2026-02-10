const NotFoundPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <h1 className="text-5xl font-bold text-purple-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <a href="/" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow hover:from-purple-500 hover:to-pink-400 transition">
        Go Home
      </a>
    </div>
  );
  export default NotFoundPage;