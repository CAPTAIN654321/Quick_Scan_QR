"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateRenderer from "@/components/Templates/TemplateRenderer";

export default function ViewTemplate() {
  const { id } = useParams();
  const [qrData, setQrData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optimized fetch using the specific getbyid endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/qr/getbyid/${id}`)
      .then(res => res.json())
      .then(found => {
        if (found && found.template) {
          setQrData(found);
          // Now fetch the template name
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/template/all`)
            .then(res => res.json())
            .then(templates => {
              const temp = templates.find(t => t._id === found.template);
              setTemplateData(temp);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!qrData || !templateData) {
    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex items-center justify-center font-black italic uppercase tracking-widest">
        Asset Not Found or No Template Assigned
      </div>
    );
  }

  return (
    <TemplateRenderer 
        templateName={templateData.name} 
        config={qrData.customConfig || templateData.config} 
    />
  );
}
