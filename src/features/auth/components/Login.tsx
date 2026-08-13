"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWalletRounded,
  EmailOutlined,
  LockOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import { AppButton, AppTextField } from "@/base/components/ui";
import SidebarBrand from "@/base/components/layout/sidebar/SidebarBrand";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.15fr) minmax(440px, 0.85fr)",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          bgcolor: "primary.dark",
        }}
      >
        <Image
          src="/login-travel.svg"
          alt="Image"
          fill
          preload
          style={{ objectFit: "cover" }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 4,
            color: "common.white",
            // background:
            //   "linear-gradient(180deg, rgba(6,28,68,.35) 0%, transparent 42%, rgba(6,28,68,.72) 100%)",
          }}
        >
          <Stack>
            <SidebarBrand />
          </Stack>

          <Box sx={{ maxWidth: 560 }}>
            <Typography
              component="p"
              sx={{
                fontSize: "52px",
                fontFamily: "var(--font-display)",
              }}
            >
              Đi xa hơn, chi tiêu thông minh hơn.
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,.82)",
                fontSize: "16px",
              }}
            >
              Lên kế hoạch ngân sách và tận hưởng trọn vẹn từng hành trình.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: "text.primary",
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              fontWeight: 600,
            }}
          >
            Chào mừng trở lại
          </Typography>
          <Typography color="text.secondary">
            Đăng nhập để tiếp tục quản lý những chuyến đi của bạn.
          </Typography>

          <Stack
            component="form"
            spacing={2}
            onSubmit={(event) => event.preventDefault()}
          >
            <AppTextField
              label="Email"
              name="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <AppTextField
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                        edge="end"
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack
              sx={{ alignItems: "center", justifyContent: "space-between" }}
              direction={"row"}
            >
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Ghi nhớ đăng nhập"
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "14px" },
                }}
              />
              <Typography
                component={Link}
                href="#"
                sx={{
                  color: "primary.main",
                  fontSize: "14px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Quên mật khẩu?
              </Typography>
            </Stack>

            <AppButton
              type="submit"
              fullWidth
              sx={{ mt: "8px !important", minHeight: 54 }}
            >
              Đăng nhập
            </AppButton>
          </Stack>
          <Stack
            spacing={"4px"}
            direction={"row"}
            sx={{ justifyContent: "center" }}
          >
            <Typography align="center" color="text.secondary">
              Chưa có tài khoản?
            </Typography>
            <Box
              component={Link}
              href="#"
              sx={{ color: "primary.main", fontWeight: 700 }}
            >
              Đăng ký ngay
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
