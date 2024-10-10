"use client";

import Card from "../../components/Card";
import Header from "../../components/Header";
import ProtectedRoute from "../../hoc/protectedRoutes";

function Home() {
  return (
    <>
      <Header />
      <section className="pt-28 ">
        <h1 className="px-6 text-2xl font-semibold pb-4 md:px-10 lg:px-16 xl:px-24">
          Perguntas
        </h1>
        <div className="px-6 grid justify-center items-center md:grid-cols-2 md:gap-4 md:px-10 lg:grid-cols-3 lg:px-16 xl:grid-cols-4 xl:px-24">
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non neque sit amet nulla tincidunt aliquam in et nisi. Sed eu dolor id ligula fringilla tempus ultricies id justo. Fusce vel mauris elementum, consequat tortor eu, euismod orci."
            initialLikes={12}
          />
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non neque sit amet nulla tincidunt aliquam in et nisi. Sed eu dolor id ligula fringilla tempus ultricies id justo. Fusce vel mauris elementum, consequat tortor eu, euismod orci."
            initialLikes={12}
          />
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non neque sit amet nulla tincidunt aliquam in et nisi. Sed eu dolor id ligula fringilla tempus ultricies id justo. Fusce vel mauris elementum, consequat tortor eu, euismod orci."
            initialLikes={12}
          />
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non neque sit amet nulla tincidunt aliquam in et nisi. Sed eu dolor id ligula fringilla tempus ultricies id justo. Fusce vel mauris elementum, consequat tortor eu, euismod orci."
            initialLikes={12}
          />
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
