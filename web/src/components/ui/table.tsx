import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

type ChildrenProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className = "" }: ChildrenProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className={`w-full text-left text-sm text-slate-700 ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className = "" }: ChildrenProps) {
  return (
    <thead className={`bg-slate-50 text-xs uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }: ChildrenProps) {
  return <tbody className={`divide-y divide-slate-100 ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = "" }: ChildrenProps) {
  return <tr className={`hover:bg-slate-50 ${className}`}>{children}</tr>;
}

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode };

export function TableHead({ children, className = "", ...rest }: TableHeadProps) {
  return (
    <th scope="col" className={`px-4 py-3 font-medium ${className}`} {...rest}>
      {children}
    </th>
  );
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode };

export function TableCell({ children, className = "", ...rest }: TableCellProps) {
  return (
    <td className={`px-4 py-3 align-top ${className}`} {...rest}>
      {children}
    </td>
  );
}

type TableEmptyProps = {
  children: ReactNode;
  colSpan: number;
};

export function TableEmpty({ children, colSpan }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-slate-500">
        {children}
      </td>
    </tr>
  );
}
