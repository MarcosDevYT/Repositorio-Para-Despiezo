import { MainContainer } from "@/components/layout/MainContainer";

export default async function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainContainer className="container mx-auto px-4 py-16 min-h-[82.5vh] flex flex-col items-center justify-center">
      {children}
    </MainContainer>
  );
}
