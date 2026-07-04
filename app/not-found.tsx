import StatusPage from "@/components/statusPage";

export default function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      description="Sorry, we couldn't find the page you're looking for."
      homeLabel="Go back home"
      supportLabel="Contact support"
    />
  );
}
