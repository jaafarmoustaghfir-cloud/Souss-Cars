import React, { useState, useMemo } from 'react';
import { 
  X, 
  Users, 
  Fuel, 
  Gauge, 
  Wind, 
  Luggage, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Sparkles, 
  Clock, 
  Car, 
  Info,
  Check,
  Send,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/initialData';
import { validateMoroccanPhone } from '../utils/moroccoPhone';

export const VehicleDetailModal: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, addReservation, isVehicleAvailable, getVehicleBookedDates } = useApp();

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Aéroport Agadir Al Massira (Gratuit)');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittedReservationId, setSubmittedReservationId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Phone validation check in real-time (Must be placed before any conditional returns)
  const phoneValidation = useMemo(() => {
    if (!clientPhone.trim()) return null;
    return validateMoroccanPhone(clientPhone);
  }, [clientPhone]);

  // Calculate rental days and total cost (Must be placed before any conditional returns)
  const { totalDays, totalPrice, datesValid, isAvailable } = useMemo(() => {
    if (!selectedVehicle || !startDate || !endDate) {
      return { totalDays: 1, totalPrice: selectedVehicle?.price || 250, datesValid: false, isAvailable: true };
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return { totalDays: 0, totalPrice: 0, datesValid: false, isAvailable: false };
    }

    const available = isVehicleAvailable(selectedVehicle.id, startDate, endDate);
    return {
      totalDays: days,
      totalPrice: days * selectedVehicle.price,
      datesValid: true,
      isAvailable: available
    };
  }, [startDate, endDate, selectedVehicle, isVehicleAvailable]);

  if (!selectedVehicle) return null;

  const images = selectedVehicle.images && selectedVehicle.images.length > 0
    ? selectedVehicle.images
    : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'];

  // Booked periods for display
  const bookedPeriods = getVehicleBookedDates(selectedVehicle.id);

  // WhatsApp formatted link
  const generateWhatsAppLink = () => {
    let msg = `Bonjour *Sky Souss Cars*,\n\n`;
    msg += `Je souhaite effectuer une réservation :\n`;
    msg += `🚗 *Véhicule :* ${selectedVehicle.name} (${selectedVehicle.category})\n`;
    msg += `💰 *Tarif journalier :* ${selectedVehicle.price} DH/jour\n`;

    if (startDate && endDate && datesValid) {
      msg += `📅 *Dates :* Du ${startDate} au ${endDate} (${totalDays} jour${totalDays > 1 ? 's' : ''})\n`;
      msg += `💵 *Montant estimé :* ${totalPrice} DH\n`;
    }

    msg += `📍 *Lieu de livraison :* ${pickupLocation}\n`;

    if (clientName) msg += `👤 *Nom du client :* ${clientName}\n`;
    if (clientPhone) msg += `📞 *Téléphone :* ${clientPhone}\n`;
    if (clientNotes) msg += `📝 *Notes :* ${clientNotes}\n`;

    msg += `\nMerci de me contacter pour valider la réservation sans paiement en ligne.`;

    return `https://wa.me/${BUSINESS_INFO.phonePrimaryRaw}?text=${encodeURIComponent(msg)}`;
  };

  const handleDirectBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPhoneTouched(true);

    // 1. Client Name validation
    if (!clientName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
      return;
    }

    // 2. Phone validation (+212 check)
    const phoneCheck = validateMoroccanPhone(clientPhone);
    if (!phoneCheck.isValid) {
      setErrorMessage(phoneCheck.errorMessage || 'Numéro de téléphone marocain invalide (+212 / 06 / 07 / 05).');
      return;
    }

    // 3. Dates validation
    if (!startDate || !endDate) {
      setErrorMessage('Veuillez sélectionner les dates de début et de fin de location.');
      return;
    }

    if (!datesValid) {
      setErrorMessage('La date de fin doit être postérieure à la date de début de location.');
      return;
    }

    if (!isAvailable) {
      setErrorMessage('Ce véhicule est déjà réservé sur cette période. Veuillez choisir d’autres dates.');
      return;
    }

    // Save reservation with status "En attente" to AppContext
    const created = addReservation({
      clientName: clientName.trim(),
      clientPhone: phoneCheck.formatted,
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehicleImage: images[0],
      startDate,
      endDate,
      totalDays,
      pricePerDay: selectedVehicle.price,
      totalPrice,
      pickupLocation,
      returnLocation: pickupLocation,
      notes: clientNotes.trim() || undefined,
      status: 'En attente'
    });

    setSubmittedReservationId(created.id);
    setBookingSuccess(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#000000]/85 backdrop-blur-md overflow-y-auto"
      onClick={() => setSelectedVehicle(null)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedVehicle(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0D0D0D]/90 hover:bg-[#F5C518] hover:text-[#0D0D0D] border border-zinc-700 transition-all cursor-pointer"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingSuccess ? (
          /* Confirmation Screen after submission */
          <div className="p-6 sm:p-12 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#F5C518]/20 border-2 border-[#F5C518] text-[#F5C518] flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Statut : En attente de confirmation
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Votre demande a bien été envoyée !
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Merci <strong className="text-white">{clientName}</strong>. Notre équipe va vous contacter très rapidement au <strong className="text-[#F5C518]">{phoneValidation?.formatted || clientPhone}</strong> pour valider votre dossier et préparer votre véhicule.
              </p>
            </div>

            {/* Request Summary Card */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-zinc-800 max-w-md mx-auto text-left text-xs sm:text-sm space-y-2.5 shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400 font-medium">Référence demande :</span>
                <span className="font-mono font-bold text-[#F5C518]">#{submittedReservationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Véhicule réservé :</span>
                <span className="font-bold text-white">{selectedVehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Période souhaitée :</span>
                <span className="font-bold text-white">Du {startDate} au {endDate} ({totalDays} jour{totalDays > 1 ? 's' : ''})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Lieu de livraison :</span>
                <span className="font-bold text-white">{pickupLocation}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 text-sm font-bold">
                <span className="text-zinc-300">Montant total estimé :</span>
                <span className="font-black text-[#F5C518] text-base">{totalPrice} DH</span>
              </div>
              <div className="text-[11px] text-zinc-400 pt-1 italic text-center">
                ✨ Aucun paiement en ligne requis — Règlement sur place lors de la remise des clés à Agadir.
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-md mx-auto">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-black text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-lg transition-all hover:scale-102"
              >
                <MessageCircle className="w-4 h-4 fill-zinc-950" />
                <span>Ouvrir aussi sur WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedVehicle(null)}
                className="flex-1 px-5 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Terminer & Retour
              </button>
            </div>
          </div>
        ) : (
          /* Normal Vehicle Modal View & Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Left Column: Gallery & Specs */}
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-zinc-800">
              {/* Main Image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={images[activeImgIdx]}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-[#0D0D0D]/90 text-xs font-bold text-[#F5C518] border border-[#F5C518]/30">
                  {selectedVehicle.category}
                </span>
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIdx(i)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImgIdx === i ? 'border-[#F5C518] scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Description */}
              <div>
                <span className="text-xs font-bold text-[#F5C518] uppercase tracking-wider">
                  {selectedVehicle.brand}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  {selectedVehicle.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  {selectedVehicle.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Caractéristiques & Équipements
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300">
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-zinc-800 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#F5C518]" />
                    <span>Boîte {selectedVehicle.transmission}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-zinc-800 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-[#F5C518]" />
                    <span>{selectedVehicle.fuel}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-zinc-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#F5C518]" />
                    <span>{selectedVehicle.seats} Places</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-zinc-800 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#F5C518]" />
                    <span>Climatisation A/C</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-zinc-800 flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-[#F5C518]" />
                    <span>{selectedVehicle.luggage || 3} Valises</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-zinc-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F5C518]" />
                    <span>Année {selectedVehicle.year}</span>
                  </div>
                </div>
              </div>

              {/* Included Benefits */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2 text-zinc-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Assurance Tous Risques Incluse</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#F5C518]" />
                  <span>Kilométrage illimité sur tout le Maroc</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#F5C518]" />
                  <span>Livraison & Récupération Aéroport Agadir Al Massira 7j/7</span>
                </div>
              </div>

              {/* Booked dates indicator if any */}
              {bookedPeriods.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Périodes déjà occupées pour ce véhicule :
                  </div>
                  <div className="space-y-0.5 text-[11px] text-amber-200/80">
                    {bookedPeriods.map((p, idx) => (
                      <div key={idx}>• Du {p.start} au {p.end}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Dedicated Real Booking Form */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#161616] flex flex-col justify-between space-y-5">
              <div>
                {/* Form Title & Policy Banner */}
                <div className="pb-3 border-b border-zinc-800 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white font-heading">
                        Formulaire de Réservation
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Remplissez vos informations pour bloquer votre véhicule.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#F5C518] font-heading">
                        {selectedVehicle.price} DH
                      </span>
                      <span className="text-[10px] text-zinc-400 block -mt-1">/ jour</span>
                    </div>
                  </div>
                  
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5C518]/10 border border-[#F5C518]/25 text-[11px] text-[#F5C518] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sans paiement en ligne · Règlement à la livraison</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleDirectBooking} className="space-y-4">
                  {/* 1. Client Full Name (Required) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                      <span>Nom complet du client <span className="text-rose-400">*</span></span>
                      <span className="text-[10px] text-zinc-500 font-normal">Obligatoire</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Mohamed Alami"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518] transition-colors"
                    />
                  </div>

                  {/* 2. Client Phone Number (Required with +212 Moroccan format) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                      <span>Numéro de téléphone (+212) <span className="text-rose-400">*</span></span>
                      <span className="text-[10px] text-zinc-500 font-normal">Appel & WhatsApp</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: 06 65 86 86 00 ou +212 6..."
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(e.target.value);
                        setPhoneTouched(true);
                      }}
                      onBlur={() => setPhoneTouched(true)}
                      required
                      className={`w-full bg-[#1e1e1e] border text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
                        phoneTouched && clientPhone.trim()
                          ? phoneValidation?.isValid
                            ? 'border-emerald-500/70 focus:border-emerald-500'
                            : 'border-rose-500/70 focus:border-rose-500'
                          : 'border-zinc-700 focus:border-[#F5C518]'
                      }`}
                    />
                    {phoneTouched && clientPhone.trim() && phoneValidation && (
                      <div className={`text-[10px] flex items-center gap-1 ${
                        phoneValidation.isValid ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {phoneValidation.isValid ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Format validé : {phoneValidation.formatted}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>Format marocain recommandé (ex: 06 12 34 56 78 ou +212 6...)</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3 & 4. Rental Dates (Start & End) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F5C518]" />
                        <span>Date de début <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F5C518]" />
                        <span>Date de fin <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        required
                        className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Availability Badge */}
                  {startDate && endDate && (
                    <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      isAvailable 
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                        : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                    }`}>
                      {isAvailable ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>Disponible pour {totalDays} jour{totalDays > 1 ? 's' : ''} (Total : {totalPrice} DH)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          <span>Véhicule indisponible sur ces dates</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Delivery Location */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F5C518]" />
                      Lieu de livraison à Agadir
                    </label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors cursor-pointer"
                    >
                      <option value="Aéroport Agadir Al Massira (Gratuit)">Aéroport Agadir Al Massira (Gratuit)</option>
                      <option value="Agence Hay Elhouda, Agadir">Agence Hay Elhouda, Agadir</option>
                      <option value="Hôtel / Riad à Agadir Centre">Hôtel / Riad à Agadir Centre</option>
                      <option value="Taghazout / Taghazout Bay">Taghazout / Taghazout Bay</option>
                      <option value="Gare Routière Al Massira Agadir">Gare Routière Al Massira Agadir</option>
                    </select>
                  </div>

                  {/* Optional Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Demande particulière / Heure de vol (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Arrivée vol AT450 à 15h30, siège bébé..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
                    />
                  </div>

                  {/* Price Calculation Summary */}
                  {startDate && endDate && datesValid && (
                    <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-zinc-800 text-xs space-y-1.5">
                      <div className="flex justify-between text-zinc-400">
                        <span>{selectedVehicle.price} DH x {totalDays} jours</span>
                        <span className="text-white font-medium">{totalPrice} DH</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Assurance tous risques</span>
                        <span className="text-emerald-400 font-bold">Incluse</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Livraison & Récupération</span>
                        <span className="text-emerald-400 font-bold">Gratuite</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-800 pt-1.5 text-sm font-bold">
                        <span className="text-white font-heading">Total à régler à la livraison :</span>
                        <span className="text-[#F5C518] font-black">{totalPrice} DH</span>
                      </div>
                    </div>
                  )}

                  {/* 5. Main Submission Button */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-sm sm:text-base py-4 px-4 rounded-xl shadow-xl shadow-[#F5C518]/20 transition-all hover:scale-102 active:scale-98 font-heading cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Envoyer la demande de réservation</span>
                    </button>

                    {/* Secondary WhatsApp Alternative */}
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-zinc-700 transition-colors text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Ou réserver directement par WhatsApp</span>
                    </a>
                  </div>
                </form>
              </div>

              {/* Direct Help Footer */}
              <div className="text-center pt-2 border-t border-zinc-800/80">
                <a
                  href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
                  className="text-xs text-zinc-400 hover:text-[#F5C518] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F5C518]" />
                  <span>Assistance téléphonique 24h/24 : {BUSINESS_INFO.phonePrimary}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
