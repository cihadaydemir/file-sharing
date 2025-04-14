import { IconFile, IconGallery, IconX } from "@intentui/icons"

import { Button } from "./ui/button"
import { Description } from "./ui/field"
import type { DropEvent } from "@react-types/shared"
import { DropZone } from "./ui/drop-zone"
import { FileTrigger } from "./ui/file-trigger"
import { isFileDropItem } from "react-aria-components"
import { toast } from "sonner"
import { useFileUpload } from "../hooks/useFileUpload"
import { useState } from "react"

export const FileDrop = () => {
  const [droppedFile, setDroppedFile] = useState<File[] | undefined>(undefined)
  const uploadFile = useFileUpload()
  const onDropHandler = async (e: DropEvent) => {
    const item = e.items.filter(isFileDropItem)
    const files = await Promise.all(item.map((item) => item.getFile()))
    if (files) {
      if (droppedFile) {
        setDroppedFile([...droppedFile, ...files])
      } else {
        setDroppedFile(files)
      }
    }
  }

  const onSelectHandler = async (e: any) => {
    if (e) {
      const files = Array.from([...e])
      const item = files[0]

      if (item) {
        if (droppedFile) {
          setDroppedFile([...droppedFile, ...files])
        } else {
          setDroppedFile(files)
        }
      }
    }
  }
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <DropZone
        getDropOperation={(types) =>
          types.has("image/jpeg") || types.has("image/png") || types.has("application/pdf")
            ? "copy"
            : "cancel"
        }
        onDrop={onDropHandler}
        className={"min-h-[80%] w-full min-w-full"}
      >
        {droppedFile ? (
          // <img alt="" src={droppedFile} className="aspect-square size-full object-contain" />
          <div className="flex flex-row gap-2 ">
            {droppedFile.map((file) => (
              <div
                key={file.name}
                className="group/file-card flex max-w-xs flex-col rounded-md border border-border p-4 hover:border-fg"
              >
                <div className=" relative flex justify-between">
                  <IconFile className="size-5" />
                  <Button
                    size="square-petite"
                    intent="plain"
                    onPress={() => {
                      setDroppedFile((prev) =>
                        prev?.filter((prevFile) => prevFile.name === file.name),
                      )
                    }}
                    className={"invisible group-hover/file-card:visible"}
                  >
                    <IconX />
                  </Button>
                </div>
                <p className="line-clamp-1 w-sm truncate text-ellipsis">
                  {file.name}{" "}
                  <span className="text-muted-fg">({file.size.toLocaleString("de")} kb)</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid space-y-3">
            <div className="mx-auto grid size-12 place-content-center rounded-full border bg-secondary/70 group-data-[drop-target]:border-primary/70 group-data-[drop-target]:bg-primary/20">
              <IconGallery className="size-5" />
            </div>
            <div className="flex justify-center">
              <FileTrigger
                acceptedFileTypes={["image/png", "image/jpeg", "application/pdf"]}
                allowsMultiple={false}
                onSelect={onSelectHandler}
              >
                Upload a file
              </FileTrigger>
            </div>
            <Description>Or drag and drop PNG, JPG, GIF or PDFs up to 10MB</Description>
          </div>
        )}
        {/* <input type="hidden" name="image" value={droppedFile} /> */}
      </DropZone>
      <Button
        onPress={() => {
          if (droppedFile) {
            uploadFile.mutate(droppedFile, {
              onSuccess: (data, variables, ctx) => {
                if (data.sucess) {
                  toast.success(`${variables.length} Files uploaded successfully.`)
                } else {
                  toast.error("Files couldn't be uploaded.")
                }
              },
              onError: () => toast.error("Something went wrong."),
            })
          }
        }}
      >
        Upload
      </Button>
    </div>
  )
}
