import type { Metadata } from "next";
import { PetsManager } from "@/components/account/PetsManager";
import { getMyPetsAction } from "@/lib/actions/grooming";

export const metadata: Metadata = { title: "Mis mascotas" };

const PetsPage = async () => {
  const pets = await getMyPetsAction();

  return <PetsManager pets={pets} />;
};

export default PetsPage;
