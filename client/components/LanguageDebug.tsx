import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function LanguageDebug() {
  const { t, currentLanguage, getCurrentLanguageInfo, setLanguage } =
    useLanguage();
  const [renderCount, setRenderCount] = useState(0);
  const [localStorageValue, setLocalStorageValue] = useState("");

  useEffect(() => {
    setRenderCount((prev) => prev + 1);
    // Check localStorage value
    try {
      const stored = localStorage.getItem("td_consulting_language");
      setLocalStorageValue(stored || "null");
    } catch (error) {
      setLocalStorageValue("error");
    }
  }, [currentLanguage]);

  const testLanguageSwitch = () => {
    const newLang = currentLanguage === "en" ? "vi" : "en";
    setLanguage(newLang);
  };

  return (
    <Card className="mt-4 border-dashed border-amber-300 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          🔧 Language Debug
          <Badge variant="secondary" className="text-xs">
            Renders: {renderCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Current Language:</strong> {currentLanguage}
        </div>
        <div>
          <strong>LocalStorage:</strong> {localStorageValue}
        </div>
        <div>
          <strong>Language Info:</strong> {getCurrentLanguageInfo().flag}{" "}
          {getCurrentLanguageInfo().nativeName}
        </div>
        <div>
          <strong>Sample Translation:</strong> "{t("nav.dashboard")}"
        </div>
        <div>
          <strong>Company Name:</strong> "{t("company.name")}"
        </div>
        <div>
          <strong>Document Lang:</strong> {document.documentElement.lang}
        </div>
        <div>
          <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
        </div>
        <Button
          onClick={testLanguageSwitch}
          size="sm"
          variant="outline"
          className="mt-2"
        >
          Test Switch ({currentLanguage === "en" ? "VI" : "EN"})
        </Button>
      </CardContent>
    </Card>
  );
}
