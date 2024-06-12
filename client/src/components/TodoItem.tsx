import { Badge, Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";

const TodoItem = ({ todo }: { todo: Todo }) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    const { mutate: updateTodo, isPending: isUpdating } = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async () => {

            if (todo.completed) toast({ title: "Task already is completed", status: "success", position: "top-right", isClosable: true });

            try {
                const res = await fetch(BASE_URL + `/todo/${todo._id}`, {
                    method: "PATCH",
                });

                const data = await res.json();
                if (!res.ok) {
                    console.log(data.error);
                    toast({ title: "Something went wrong", status: "error", position: "top-right", isClosable: true })
                }

                return data;
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteTodo"],
        mutationFn: async () => {
            try {
                const res = await fetch(BASE_URL + `/todo/${todo._id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return (
        <Flex gap={2} alignItems={"center"}>
            <Flex
                flex={1}
                alignItems={"center"}
                border={"1px"}
                borderColor={"gray.600"}
                p={2}
                borderRadius={"lg"}
                justifyContent={"space-between"}
            >
                <Text
                    textDecoration={todo.completed ? "line-through" : "none"}
                >
                    {todo.title}
                </Text>
                {todo.completed && (
                    <Badge ml='1' colorScheme='green'>
                        Done
                    </Badge>
                )}
                {!todo.completed && (
                    <Badge ml='1' colorScheme='yellow'>
                        In Progress
                    </Badge>
                )}
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Box color={"green.500"} cursor={"pointer"} onClick={() => updateTodo()}>
                    {!isUpdating && <FaCheckCircle size={20} />}
                    {isUpdating && <Spinner size={"sm"} />}
                </Box>
                <Box color={"red.500"} cursor={"pointer"} onClick={() => deleteTodo()}>
                    {!isDeleting && <MdDelete size={25} />}
                    {isDeleting && <Spinner size={"sm"} />}
                </Box>
            </Flex>
        </Flex>
    );
};
export default TodoItem;