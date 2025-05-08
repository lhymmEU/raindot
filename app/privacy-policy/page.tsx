import Footer from "../components/footer";
import Header from "../components/header";
import Hero from "../components/hero";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <Hero title="Privacy Policy" />
      <div className="flex flex-col gap-[28px] px-[82px] py-[50px]">
        <div className="flex flex-col gap-[38px]">
          <h1 className="text-[24px] font-[500]">Title</h1>
          <p className="text-[18px] font-[500]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="flex flex-col gap-[38px]">
          <h1 className="text-[24px] font-[500]">Title</h1>
          <p className="text-[18px] font-[500]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
