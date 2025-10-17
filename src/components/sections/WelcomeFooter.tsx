export function WelcomeFooter() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1a1a1a] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-4">Kontak Kami</h4>
            <ul className="space-y-2 text-[#AAAAAA]">
              <li>+6281380935185</li>
              <li>@nurtiyas.id</li>
              <li>Jakarta Timur, Indonesia</li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>
          <div className="text-[#AAAAAA] md:text-right self-end">
            <p>Dikembangkan Oleh <span className="font-semibold text-white">NURTIYAS</span></p>
          </div>
        </div>
      </div>
    </footer>
  )
}
