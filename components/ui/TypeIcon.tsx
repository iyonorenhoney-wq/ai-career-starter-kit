/**
 * AI活用タイプのアイコン
 *
 * 出典: docs/08_web-spec.md §103-104
 *
 * アイコンは装飾ではなく、タイプを識別するために使う。
 * ブランドカラーを増やさない代わりに、アイコンとモチーフでタイプ差を出す（同 §105）。
 */

import { Blocks, Briefcase, Package, PenTool, Users } from "lucide-react";
import type { ComponentType } from "react";
import type { TypeIconName } from "@/types/content";

/** 仕様書で指定されたアイコン名と、実際のコンポーネントの対応 */
const ICONS: Record<
  TypeIconName,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Briefcase,
  PenTool,
  Users,
  Package,
  Blocks,
};

type TypeIconProps = {
  name: TypeIconName;
  className?: string;
  strokeWidth?: number;
};

export function TypeIcon({
  name,
  className,
  strokeWidth = 1.5,
}: TypeIconProps) {
  const Icon = ICONS[name];
  // アイコン単体では意味を持たせず、必ず文字と併記する前提のため読み上げから外す
  return (
    <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />
  );
}
