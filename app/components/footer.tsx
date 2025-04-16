import { Youtube, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">THE PORTAL</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="#" className="block">
              CONTACT
            </Link>
            <Link href="#" className="block">
              FEEDBACK FORM
            </Link>
            <Link href="#" className="block">
              PRIVACY POLICY
            </Link>
          </div>

          <div className="space-y-4">
            <Link href="#" className="block">
              LU.MA CAL
            </Link>
            <Link href="#" className="block">
              LINK 1
            </Link>
            <Link href="#" className="block">
              LINK 2
            </Link>
          </div>

          <div className="flex justify-end space-x-4 items-start">
            <Link href="#" className="text-white">
              <Youtube className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-white">
              <Twitter className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
