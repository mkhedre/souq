import { readDB } from "@/lib/db";
import SettingsForm from "@/components/SettingsForm";
import { GearIcon } from "@/components/Icons";
export default function Settings() { const db = readDB(); return (<><h1><GearIcon /> إعدادات المتجر</h1><SettingsForm settings={db.settings} categories={db.categories} /></>); }
