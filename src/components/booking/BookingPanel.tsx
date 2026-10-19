"use client";

import { useEffect, useState } from "react";
import { BedDouble, Sailboat } from "lucide-react";
import type { Activity, RoomType } from "@/lib/data/mappers";
import { cn } from "@/lib/utils";
import { BookingForm } from "./BookingForm";
import { ActivityRequestForm } from "./ActivityRequestForm";

interface Props {
  propertySlug: string;
  propertyName: string;
  rooms: RoomType[];
  activities: Activity[];
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

type Tab = "stay" | "tour";

/** Switches between the room-stay form (with tour add-ons) and the tour-only request form. */
export function BookingPanel({ propertySlug, propertyName, rooms, activities, checkInTime, checkOutTime, notes }: Props) {
  const hasRooms = rooms.length > 0;
  const hasTours = activities.length > 0;
  const [tab, setTab] = useState<Tab>(hasRooms ? "stay" : "tour");
  const [preset, setPreset] = useState<{ roomId?: string; activityId?: string }>({});

  // Card buttons elsewhere on the page choose the tab; the mounted form handles its own pre-selection.
  useEffect(() => {
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement;
      const room = t.closest<HTMLElement>(".book-room");
      const addOn = t.closest<HTMLElement>(".add-activity");
      const tour = t.closest<HTMLElement>(".book-tour");
      if (room?.dataset.room) {
        setPreset({ roomId: room.dataset.room });
        setTab("stay");
      } else if (addOn?.dataset.activity) {
        setPreset({ activityId: addOn.dataset.activity });
        setTab("stay");
      } else if (tour?.dataset.activity) {
        setPreset({ activityId: tour.dataset.activity });
        setTab("tour");
      } else return;
      e.preventDefault();
      requestAnimationFrame(() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!hasRooms && !hasTours) return null;

  return (
    <div id="book" className="scroll-mt-24">
      {hasRooms && hasTours && (
        <div role="tablist" aria-label="Booking type" className="mb-4 inline-flex rounded-lg border border-white/10 bg-navy-900 p-1">
          <TabButton active={tab === "stay"} onClick={() => setTab("stay")} icon={BedDouble}>Room stay</TabButton>
          <TabButton active={tab === "tour"} onClick={() => setTab("tour")} icon={Sailboat}>Island hopping only</TabButton>
        </div>
      )}
      {tab === "stay" && hasRooms ? (
        <BookingForm key="stay" propertySlug={propertySlug} propertyName={propertyName} rooms={rooms} activities={activities} checkInTime={checkInTime} checkOutTime={checkOutTime} notes={notes} initialRoomId={preset.roomId} initialActivityId={preset.activityId} />
      ) : (
        <ActivityRequestForm key="tour" propertySlug={propertySlug} propertyName={propertyName} activities={activities} notes={notes} initialActivityId={preset.activityId} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={cn("inline-flex items-center gap-2 rounded-md px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition", active ? "bg-gold-500 text-navy-900" : "text-white/70 hover:text-white")}>
      <Icon className="size-3.5" /> {children}
    </button>
  );
}
