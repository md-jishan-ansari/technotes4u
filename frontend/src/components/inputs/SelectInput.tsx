import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/componentsSadcn/ui/form'
import { Input } from '@/src/componentsSadcn/ui/input'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/src/componentsSadcn/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/componentsSadcn/ui/popover"
import { Check, ChevronDown, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const SelectInput = ({ form, name, label, placeholder, description, inputlists, defaultSet=false, className }: any) => {
    const [open, setOpen] = useState(false)
    const [inputDisplay, setInputDisplay] = useState("")

    useEffect(() => {
        const inputvalue = form.getValues(name);
        if (!inputvalue) {
            setInputDisplay("");
        } else {
            setInputDisplay(inputlists.filter((item: any) => item.value === inputvalue)[0]?.label);
        }
    }, [form.watch(name)]);

    useEffect(() => {
        if(defaultSet) {
            form.setValue(name, inputlists[0]?.value);
        }
    }, [inputlists]);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <div className="relative"
                                    tabIndex={open ? 0 : -1}  // Only make it tabbable when open
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setOpen(true);
                                        }
                                    }}
                                >
                                    <Input
                                        placeholder={placeholder}
                                        value={inputDisplay}
                                        readOnly
                                        tabIndex={open ? -1 : 0}
                                        style={{ cursor: 'pointer' }}
                                        className={`${ open ? "ring-1 ring-neutral-950 dark:ring-neutral-300": "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"}`}
                                    />
                                    {inputDisplay && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange("")
                                            }}
                                            className="flex items-center justify-center cursor-pointer h-full w-9 absolute right-8 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-75"
                                        >
                                            <X className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center cursor-pointer h-full w-9 absolute right-0 top-1/2 -translate-y-1/2 opacity-50">
                                        <ChevronDown className=" h-4 w-4" />
                                    </div>
                                </div>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-full shadow-none">
                            <Command className="rounded-lg border shadow-md w-[500px]">
                                <CommandInput autoFocus placeholder="Search blogs..." />
                                <CommandList>
                                    <CommandEmpty>No items found.</CommandEmpty>
                                    <CommandGroup>
                                        {inputlists.map((input: any) => (
                                            <CommandItem
                                                key={input.value}
                                                onSelect={() => {
                                                    field.onChange(input.value)
                                                    setOpen(false)
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {input.label}
                                                {field.value === input.value && (
                                                    <Check className="ml-auto h-4 w-4" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default SelectInput
