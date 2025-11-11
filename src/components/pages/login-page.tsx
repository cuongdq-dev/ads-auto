"use client";

import { useAuth, useI18n } from "@/components/provider";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { app } from "@/firebase";
import { HttpMethod } from "@/lib/types";
// import { HttpMethod, invokeRequest } from "@/";
import { invokeRequest } from "@/lib/api-core";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  MessageCircle,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "../ui/language-switcher";
export function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();

  const auth = getAuth(app);
  const [loading, setLoading] = useState<boolean>(false);
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const idToken = await user.getIdToken();

      await invokeRequest({
        method: HttpMethod.POST,
        baseURL: "/auth/email/login",
        params: { idToken },
        onHandleError: () => setLoading(false),
        onSuccess: async (res) => {
          const { accessToken, refreshToken, id, email, name, photoUrl } = res;

          await login(accessToken, {
            id: id,
            refreshToken: refreshToken,
            name: name,
            email: email!,
            avatar: photoUrl,
          });
          router.push("/");
        },
      });
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Đăng nhập thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <Card className="w-full border-border shadow-2xl backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-6 pb-8 pt-8">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                <Wallet className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("app.name")}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("app.tagline")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <Button
              className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              size="lg"
              disabled={loading}
              onClick={handleGoogleLogin}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("auth.continueWithGoogle")}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">
                  {t("auth.whyChooseUs")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t("auth.features.groupManagement.title")}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t("auth.features.groupManagement.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10 transition-all hover:bg-accent/10">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t("auth.features.realTimeChat.title")}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t("auth.features.realTimeChat.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-chart-4/5 border border-chart-4/10 transition-all hover:bg-chart-4/10">
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t("auth.features.smartTracking.title")}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t("auth.features.smartTracking.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-chart-5/5 border border-chart-5/10 transition-all hover:bg-chart-5/10">
                <div className="h-10 w-10 rounded-lg bg-chart-5/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-chart-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t("auth.features.securePrivate.title")}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t("auth.features.securePrivate.description")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="hidden lg:flex flex-col gap-8 animate-in slide-in-from-right duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("auth.hero.badge")}
              </span>
            </div>
            <h2 className="text-5xl font-bold text-foreground leading-tight text-balance">
              {t("auth.hero.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("auth.hero.description")}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("auth.hero.easyTracking.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("auth.hero.easyTracking.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("auth.hero.easyTracking.description")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("auth.hero.fairSplit.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("auth.hero.fairSplit.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("auth.hero.fairSplit.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
