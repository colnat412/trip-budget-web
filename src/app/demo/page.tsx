import { AppButton, AppTextArea, AppTextField } from "@/base/components/ui";
import AppCard from "@/base/components/ui/AppCard";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Card, CardContent, Stack } from "@mui/material";

const DemoPage = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 840 }}>
        <CardContent>
          <Stack spacing={3}>
            <AppTextField label="Input" type="text" placeholder="Nhập Input" />

            <AppTextArea label="TextArea" placeholder="Nhập ghi chú của bạn" />
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              <AppButton
                style={{ width: 128 }}
                intent="primary"
                size="medium"
                loading={false}
              >
                Primary
              </AppButton>
              <AppButton
                style={{ width: 128 }}
                intent="secondary"
                size="medium"
                loading={false}
              >
                Secondary
              </AppButton>
              <AppButton
                selected
                style={{
                  width: 128,
                }}
                intent="secondary"
                size="medium"
                loading={false}
              >
                SELECTED
              </AppButton>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "rgb(241, 245, 249)",
                padding: 20,
              }}
            >
              <AppCard variant="elevated" icon={<LocationOnOutlinedIcon />}>
                XIN CHAO 2026
              </AppCard>
              <AppCard variant="flat">XIN CHAO 2026</AppCard>
              <AppCard variant="outlined">XIN CHAO 2026</AppCard>
              <AppCard variant="primary">XIN CHAO 2026</AppCard>
              <AppCard variant="transparent">XIN CHAO 2026</AppCard>
              <AppCard variant="transparent">XIN CHAO 2026 </AppCard>
              <AppCard color="red" variant="danger">
                XIN CHAO 2026
              </AppCard>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DemoPage;
