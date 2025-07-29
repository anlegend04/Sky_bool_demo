import * as React from "react";
import { Check, ChevronsUpDown, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  custom?: boolean;
}

interface SearchableSelectProps {
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  allowCustom?: boolean;
  allowMultiple?: boolean;
  onAddCustom?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  allowCustom = false,
  allowMultiple = false,
  onAddCustom,
  className,
  disabled = false,
  clearable = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showCustomDialog, setShowCustomDialog] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");

  const selectedValues = React.useMemo(() => {
    if (allowMultiple) {
      return Array.isArray(value) ? value : value ? [value] : [];
    }
    return typeof value === "string" ? [value] : [];
  }, [value, allowMultiple]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const selectedOption = React.useMemo(() => {
    if (allowMultiple) return null;
    return options.find((option) => option.value === value);
  }, [options, value, allowMultiple]);

  const handleSelect = (selectedValue: string) => {
    if (allowMultiple) {
      const currentValues = selectedValues;
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onValueChange(newValues);
    } else {
      onValueChange(selectedValue === value ? "" : selectedValue);
      setOpen(false);
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    if (allowMultiple) {
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      onValueChange(newValues);
    } else {
      onValueChange("");
    }
  };

  const handleAddCustom = () => {
    if (customValue.trim() && onAddCustom) {
      onAddCustom(customValue.trim());
      if (allowMultiple) {
        onValueChange([...selectedValues, customValue.trim()]);
      } else {
        onValueChange(customValue.trim());
      }
      setCustomValue("");
      setShowCustomDialog(false);
      setOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (allowMultiple) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find((opt) => opt.value === selectedValues[0]);
        return option?.label || selectedValues[0];
      }
      return `${selectedValues.length} selected`;
    }
    return selectedOption?.label || placeholder;
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {allowMultiple && selectedValues.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-w-full">
                  {selectedValues.slice(0, 2).map((val) => {
                    const option = options.find((opt) => opt.value === val);
                    return (
                      <Badge
                        key={val}
                        variant="secondary"
                        className="text-xs max-w-24 truncate"
                      >
                        {option?.label || val}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveValue(val);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedValues.length - 2}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="truncate">{getDisplayValue()}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {clearable && (value || selectedValues.length > 0) && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange(allowMultiple ? [] : "");
                  }}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {emptyMessage}
                  </p>
                  {allowCustom && searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomDialog(true)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add "{searchQuery}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValues.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{option.label}</span>
                          {option.badge && (
                            <Badge variant="outline" className="text-xs">
                              {option.badge}
                            </Badge>
                          )}
                          {option.custom && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
                {allowCustom && (
                  <CommandItem
                    onSelect={() => setShowCustomDialog(true)}
                    className="text-primary border-t"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add custom option</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Custom Value Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Option</DialogTitle>
            <DialogDescription>
              Create a custom option that will be available for selection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter custom value..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomDialog(false);
                setCustomValue("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustom}
              disabled={!customValue.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
