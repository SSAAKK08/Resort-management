import AdminCatalogForm from "@/components/admin/AdminCatalogForm";
export default async function EditFoodPage({ params }) {
  const { documentId } = await params;
  return <AdminCatalogForm type="food" documentId={documentId} />;
}
