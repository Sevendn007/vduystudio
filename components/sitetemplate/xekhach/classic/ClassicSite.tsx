"use client";
import { useEffect } from "react";
import Header from "./Header";
import Hero from "./Hero";
import PhotoWall from "./PhotoWall";
import BookingBar from "./BookingBar";
import Schedule from "./Schedule";
import PriceTables from "./PriceTables";
import RentalCards from "./RentalCards";
import NorthSouth from "./NorthSouth";
import Promises from "./Promises";
import Footer from "./Footer";
import ContactSheet from "../shared/ContactSheet";
import { useBooking } from "../shared/useBooking";
import type { RouteId, VehicleId } from "@/lib/sitetemplate/xekhach/data";

export default function ClassicSite() {
  const booking = useBooking();

  // class trên body để kl-base.css đổi nền trang (dự phòng cho trình duyệt chưa có :has)
  useEffect(() => {
    document.body.classList.add("kl-page", "kl-classic-page");
    return () => document.body.classList.remove("kl-page", "kl-classic-page");
  }, []);

  const bookWith = (routeId: RouteId, vehicle: VehicleId) => {
    booking.set("routeId", routeId);
    booking.set("vehicle", vehicle);
    booking.openSheet();
  };

  return (
    <div className="kl-classic">
      <Header onBook={booking.openSheet} />
      <Hero onBook={booking.openSheet} />
      <BookingBar form={booking.form} routes={booking.routes} set={booking.set} onSubmit={booking.openSheet} />
      <Schedule />
      <PhotoWall />
      <PriceTables onBook={bookWith} />
      <RentalCards />
      <NorthSouth />
      <Promises />
      <Footer />

      {booking.open && <ContactSheet form={booking.form} onChange={booking.set} onClose={booking.closeSheet} />}
    </div>
  );
}
