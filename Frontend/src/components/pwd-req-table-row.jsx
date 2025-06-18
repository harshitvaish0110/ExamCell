import React from 'react'
import { Check, Eye, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  TableCell,
  TableRow, 
} from "./ui/table";

const PwdReqTableRow = ({ isLoading, request, acceptPasswordRequest, deletePasswordRequest }) => {
    const [isShown, setIsShown] = React.useState(false)
    return (
        <TableRow key={request.email}>
            <TableCell className="font-medium">
                {request.email}
            </TableCell>
            <TableCell className="flex justify-between items-center gap-1 px-1">
                <span>{isShown ? request.password : "●●●●●●●●"}</span>
                <Button
                    onClick={() => setIsShown(!isShown)}
                >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Toggle Password Visibility</span>
                </Button>
            </TableCell>
            <TableCell className='text-center'>
                {`${new Date(request.timestamp).toLocaleDateString()} - ${new Date(request.timestamp).toTimeString().slice(0, 8)}`}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer"
                        disabled={isLoading}
                        onClick={() => acceptPasswordRequest(request.email)}
                    >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="sr-only">Approve</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        disabled={isLoading}
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => deletePasswordRequest(request.email)}
                    >
                        <X className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Reject</span>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default PwdReqTableRow