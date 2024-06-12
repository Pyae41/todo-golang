import { Flex, Spinner, Stack, Text, useToast } from "@chakra-ui/react";

import TodoItem from "./TodoItem";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";

export type Todo = {
    _id: number;
    title: string;
    completed: boolean;
};

const TodoList = () => {
    const toast = useToast();
    const { data: todos, isLoading } = useQuery<Todo[]>({
        queryKey: ["todos"],
        queryFn: async () => {
            try {
                const res = await fetch(BASE_URL + "/todos");
                const data = await res.json();

                if (!res.ok) {
                    console.log(data.error);
                    toast({ title: "Something went wrong", status: "error", position: "top-right", isClosable: true })
                }

                return data.todos || [];
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <>
            <Text
                fontSize={"4xl"}
                textTransform={"uppercase"}
                fontWeight={"bold"}
                textAlign={"center"}
                my={2}
                bgGradient='linear(to-l, #0b85f8, #00ffff)'
                bgClip='text'
            >
                Tasks
            </Text>
            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!isLoading && todos?.length === 0 && (
                <Stack alignItems={"center"} gap='3'>
                    <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
                        All tasks completed! 🤞
                    </Text>
                </Stack>
            )}
            <Stack gap={3}>
                {todos?.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} />
                ))}
            </Stack>
        </>
    );
};
export default TodoList;