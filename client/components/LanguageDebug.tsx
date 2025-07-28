import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function LanguageDebug() {
  const { t, currentLanguage, getCurrentLanguageInfo } = useLanguage();
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, [currentLanguage]);

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
        <div><strong>Current Language:</strong> {currentLanguage}</div>
        <div><strong>Language Info:</strong> {getCurrentLanguageInfo().flag} {getCurrentLanguageInfo().nativeName}</div>
        <div><strong>Sample Translation:</strong> "{t('nav.dashboard')}"</div>
        <div><strong>Company Name:</strong> "{t('company.name')}"</div>
        <div><strong>Timestamp:</strong> {new Date().toLocaleTimeString()}</div>
      </CardContent>
    </Card>
  );
}
