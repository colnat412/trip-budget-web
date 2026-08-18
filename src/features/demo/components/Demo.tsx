"use client";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Card, CardContent, Stack } from "@mui/material";

import { AppButton, AppCard, AppTextArea, AppTextField } from "@/base/components/ui";
import { useTranslations } from "next-intl";

export default function Demo() {
  const t = useTranslations("demo");

  return (
    <Box component="section" sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", px: 2, py: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 840 }}>
        <CardContent>
          <Stack spacing={3}>
            <AppTextField label={t("input")} placeholder={t("inputPlaceholder")} />
            <AppTextArea label={t("textArea")} placeholder={t("textAreaPlaceholder")} />
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <AppButton sx={{ width: 128 }}>Primary</AppButton>
              <AppButton sx={{ width: 128 }} intent="secondary">Secondary</AppButton>
              <AppButton selected sx={{ width: 128 }} intent="secondary">Selected</AppButton>
            </Stack>
            <Stack spacing={1.25} sx={{ bgcolor: "action.hover", p: 2.5 }}>
              <AppCard variant="elevated" icon={<LocationOnOutlinedIcon />}>{t("hello")}</AppCard>
              <AppCard variant="flat">{t("hello")}</AppCard>
              <AppCard variant="outlined">{t("hello")}</AppCard>
              <AppCard variant="primary">{t("hello")}</AppCard>
              <AppCard variant="transparent">{t("hello")}</AppCard>
              <AppCard color="red" variant="danger">{t("hello")}</AppCard>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
