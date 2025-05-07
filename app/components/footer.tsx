import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto pt-[35px] pb-[70px] px-[68px]">
        <h2 className="text-3xl font-bold mb-8">THE PORTAL</h2>

        <div className="flex gap-8 justify-between items-start">
          <div className="flex gap-32">
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
          </div>

          <div className="flex justify-end space-x-4 items-center">
            <Image src={"/YT.png"} alt={"Youtube"} width={60} height={60} />
            <Image src={"/X.png"} alt={"X"} width={40} height={40} />
          </div>
        </div>
      </div>
    </footer>
  );
}
