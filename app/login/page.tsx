import StatusPage from "@/components/statusPage";

export default function LoginPage() {
  return (
    <StatusPage
      code="403"
      title="Pagina niet toegelaten"
      description="Sorry, deze pagina zal beschikbaar zijn van zodra reserveren mogelijk is."
      homeLabel="Terug naar home"
      supportLabel="Contacteer support"
    />
  );
}
