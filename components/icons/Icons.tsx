import Image from "next/image";

export const CarIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className ?? "size-5"}`}>
      <Image
        src="/autoIcon.svg"
        alt="CarIcon"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export const ChapaIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className ?? "size-5"}`}>
      <Image
        src="/chapaIcon.svg"
        alt="ChapaIcon"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export const MotorIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className ?? "size-5"}`}>
      <Image
        src="/motorIcon.svg"
        alt="MotorIcon"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};
