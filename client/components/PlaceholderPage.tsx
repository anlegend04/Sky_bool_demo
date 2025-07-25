import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-slate-400" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-6">{description}</p>
            <p className="text-sm text-slate-500 mb-6">
              This page is ready to be built. Continue prompting to add specific functionality and content to this section.
            </p>
            <Button variant="outline">
              Request Feature Implementation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
