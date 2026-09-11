import type { ComponentPropsWithoutRef } from "react";

type DocumentLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

export default function DocumentLink({ href, ...props }: DocumentLinkProps) {
  return <a href={href} {...props} />;
}
