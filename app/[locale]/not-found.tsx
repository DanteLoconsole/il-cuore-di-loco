import { getTranslations } from "next-intl/server";
import StatusPage from "@/components/statusPage";

export default async function NotFoundPage() {
  const t = await getTranslations("status");
  return (
    <StatusPage
      code="404"
      title={t("notFoundTitle")}
      description={t("notFoundText")}
      homeLabel={t("goHome")}
      supportLabel={t("contactSupport")}
    />
  );
}
