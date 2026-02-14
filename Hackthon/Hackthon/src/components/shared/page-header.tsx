import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {icon && (
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      )}
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
