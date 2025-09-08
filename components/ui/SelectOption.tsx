"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function SelectOption({
  label = "Select Option",
  options = [],
  placeholder = "Choose an option",
  onChange,
  defaultValue,
  customSelect,
}: {
  label?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: any | null;
  customSelect?: { label: string; value: any };
}) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue || ""}>
      <SelectTrigger className="w-[220px]">
        <SelectValue className="text-black" placeholder={"select category"} />{" "}
      </SelectTrigger>{" "}
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label || "pilih kategori"}</SelectLabel>}{" "}
          {customSelect && (
            <SelectItem defaultChecked value={customSelect.value}>
              {" "}
              {customSelect.label}{" "}
            </SelectItem>
          )}{" "}
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {" "}
              {item.label}{" "}
            </SelectItem>
          ))}{" "}
        </SelectGroup>{" "}
      </SelectContent>{" "}
    </Select>
  );
}
