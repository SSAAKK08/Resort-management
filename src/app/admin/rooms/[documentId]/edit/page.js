import AdminCatalogForm from '@/components/admin/AdminCatalogForm';
export default async function EditRoomPage({ params }) { const { documentId } = await params; return <AdminCatalogForm type="room" documentId={documentId} />; }

