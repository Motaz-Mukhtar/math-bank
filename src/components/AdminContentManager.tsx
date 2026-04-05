import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { QuestionFormContainer } from "@/components/admin/QuestionFormContainer";
import { QuestionList } from "@/components/admin/QuestionList";

const AdminContentManager = () => {
  // Ref for scrolling to form
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Question management state
  const [editingQuestionId, setEditingQuestionId] = useState<string | undefined>();
  const [refreshQuestionList, setRefreshQuestionList] = useState(0);

  const handleQuestionSuccess = () => {
    setEditingQuestionId(undefined);
    setRefreshQuestionList(prev => prev + 1);
  };

  const handleQuestionEdit = (questionId: string) => {
    setEditingQuestionId(questionId);
    
    // Scroll to the form after a short delay to ensure state is updated
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleQuestionCancel = () => {
    setEditingQuestionId(undefined);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          إدارة الأسئلة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={formContainerRef}>
          <QuestionFormContainer
            questionId={editingQuestionId}
            onSuccess={handleQuestionSuccess}
            onCancel={editingQuestionId ? handleQuestionCancel : undefined}
          />
        </div>
        
        <div className="pt-6 border-t">
          <QuestionList
            key={refreshQuestionList}
            onEdit={handleQuestionEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminContentManager;
