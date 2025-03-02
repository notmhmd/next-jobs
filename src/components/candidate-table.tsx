"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


export type Candidate = {
    id: string
    full_name: string,
    date_of_birth: Date,
    years_of_experience: number,
    department: "IT" | "Finance" | "HR"
}

export const columns: ColumnDef<Candidate>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "full_name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("full_name")}</div>
        ),
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("department")}</div>
        ),
    },
    {
        accessorKey: "date_of_birth",
        header: ({ column }) => {
            return (
               <div className="text-center font-medium">
                   <Button
                       variant="ghost"
                       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                   >
                       Date Of Birth
                       <ArrowUpDown />
                   </Button>
               </div>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("date_of_birth"))
            return <div className="text-center font-medium">{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "years_of_experience",
        header: ({ column }) => {
            return (
               <div className="text-center font-medium">
                   <Button
                       variant="ghost"
                       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                   >
                       Years Of Experience
                       <ArrowUpDown />
                   </Button>
               </div>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("years_of_experience"))
            return <div className="text-center font-medium">{amount} Years</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
    },
]

export type CandidateTableProps = {
    candidates: Candidate[],
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    handleDownloadResume: (candidateId: string, candidateName:string) => void;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    setDepartment: React.Dispatch<React.SetStateAction<string | null>>;
}

export function CandidateTable({candidates, setPageIndex, pageIndex, totalCount, setDepartment, handleDownloadResume}: CandidateTableProps)  {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columnsWithHandler = React.useMemo(
        () => columns.map(col =>
            col.id === "actions"
                ? { ...col, cell: ({ row }) => {
                        const candidate = row.original;
                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(candidate.id)}
                                    >
                                        Copy Candidate ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDownloadResume(candidate.id, candidate.full_name)}>
                                        Download Resume
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    }
                }
                : col
        ),
        [handleDownloadResume]
    );
    const table = useReactTable({
        data: candidates,
        columns: columnsWithHandler,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        rowCount: totalCount,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Names..."
                    value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("full_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="px-2 w-full">
                    <Select onValueChange={setDepartment}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a Department"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Department</SelectLabel>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPageIndex((old) => Math.max(old - 1, 1))
                            table.setPageIndex((old) => Math.max(old - 1, 1))
                        }}
                        disabled={pageIndex <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPageIndex((old) => old + 1)
                            table.setPageIndex((old) => old + 1)
                        }}
                        disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CandidateTable;
