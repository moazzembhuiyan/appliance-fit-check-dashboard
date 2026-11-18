import ApplicanceListContainer from "./_Component/ApplicanceListContainer";

export const metadata = {
  title: "Appliance List - Fit Check Dashboard",
  description:
    "View and manage the list of appliances in the Fit Check Dashboard.",
};
export default function page() {
  return (
    <div>
      <ApplicanceListContainer />
    </div>
  );
}
