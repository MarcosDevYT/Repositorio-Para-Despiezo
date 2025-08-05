type UserProfileProps = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  businessName?: string | null;
  emailVerified?: Date | null;
  phoneVerified?: Date | null;
  createdAt?: Date | null;
};

export type UserEditProps = {
  name: string | null;
  phoneNumber: string | null;
  location: string | null;
  businessName: string | null;
  image: string | null;
  email: string;
  id: string;
  password: string | null;
  emailVerified: Date | null;
  phoneVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

export interface ProfileResumeProps {
  user: UserProfileProps;
}
