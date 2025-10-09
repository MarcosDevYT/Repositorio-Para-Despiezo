"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  getTrackingStatus,
  TrackingResponse,
  TrackingStatus,
} from "@/actions/order-actions";

export const OrderTracking = ({
  trackingNumber,
}: {
  trackingNumber: string | null;
}) => {
  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!trackingNumber) return null;

  useEffect(() => {
    startTransition(() => {
      getTrackingStatus(trackingNumber)
        .then((data) => {
          setTrackingData(data);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError("No se pudo obtener el estado del envío.");
        });
    });
  }, [trackingNumber]);

  return (
    <div className="w-full space-y-6">
      {isPending && <p>Cargando estado del envío...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {trackingData && (
        <div className="relative flex flex-col space-y-6">
          {/* Línea vertical estilo timeline */}
          <div className="absolute left-[11px] top-0 h-full w-[2px] bg-gray-300"></div>

          {trackingData.statuses.map((status: TrackingStatus) => (
            <div
              key={status.parcel_status_history_id}
              className="relative flex items-start space-x-4 pt-2"
            >
              {/* Punto del timeline */}
              <div className="z-10 flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 mt-1"></div>

              <div className="flex-1">
                <div className="font-semibold text-gray-900 capitalize">
                  {status.parent_status.replace(/-/g, " ")}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(status.carrier_update_timestamp).toLocaleString()}
                </div>
                {status.carrier_message && (
                  <div className="text-gray-700 mt-1">
                    {status.carrier_message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
