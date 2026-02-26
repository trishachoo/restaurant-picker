import { Restaurant } from "@/lib/sheets";
import { MapPin, Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  restaurant: Restaurant;
  highlight?: boolean;
}

export default function MatchCard({ restaurant, highlight }: MatchCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-5 card-shadow border",
        highlight
          ? "border-primary/50 ring-2 ring-primary/20"
          : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={cn("font-bold text-lg leading-tight", highlight && "text-primary")}>
          {restaurant.name}
        </h3>
        {highlight && (
          <span className="shrink-0 text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">
            Tonight&apos;s Pick!
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
          <Tag size={11} />
          {restaurant.cuisine}
        </span>
        <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
          <MapPin size={11} />
          {restaurant.area}
        </span>
        {restaurant.rating && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
            <Star size={11} fill="currentColor" />
            {restaurant.rating}
          </span>
        )}
      </div>

      {restaurant.address && (
        <p className="mt-2 text-xs text-muted-foreground">{restaurant.address}</p>
      )}

      {restaurant.notes && (
        <p className="mt-2 text-sm text-foreground/70 italic">
          &ldquo;{restaurant.notes}&rdquo;
        </p>
      )}
    </div>
  );
}
