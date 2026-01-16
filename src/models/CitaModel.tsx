import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  nombreCliente: string;
  telefonoCliente: string;
  fecha: string;
  servicios: Array<any>;
  createdAt?: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  nombreCliente: { type: String, required: true },
  telefonoCliente: { type: String, required: true },
  fecha: { type: String, required: true },
  servicios: { type: [Object], default: [] },
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;