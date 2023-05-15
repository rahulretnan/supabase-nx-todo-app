import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { supabase } from '@supabase-sdk';
import { Database } from '@supabase-sdk/types';
import { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';

type Todo = Database['public']['Tables']['todos']['Row'];

interface TasksProps {
  user: User | undefined;
}
const Tasks = ({ user }: TasksProps) => {
  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const onAddTask = async () => {
    if (!todo) return;
    try {
      await supabase.from('todos').insert({
        todo,
        user_id: user?.id as string,
      });
      setTodo('');
    } catch (e) {
      console.log(e);
    }
  };
  const onRemoveTask = async (id: string) => {
    try {
      await supabase.from('todos').delete().match({
        id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTodos = useCallback(async () => {
    supabase
      .from('todos')
      .select('*')
      .then(({ data }) => {
        setTodos(data as Todo[]);
      });
  }, []);

  useEffect(() => {
    fetchTodos();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
        },
        (payload) => {
          if (payload?.eventType === 'INSERT') {
            setTodos((prev) => [...prev, payload.new as Todo]);
          }
          if (payload?.eventType === 'DELETE') {
            setTodos((prev) =>
              prev.filter((todo) => todo.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe().then(() => console.log('Unsubscribed'));
    };
  }, []);
  return (
    <Stack spacing={3}>
      <HStack>
        <Input
          placeholder="Enter your task"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button colorScheme="blue" paddingX={8} onClick={onAddTask}>
          Add Task
        </Button>
        <IconButton
          icon={<IoLogOutOutline />}
          colorScheme="red"
          aria-label="logout"
          onClick={async () => await supabase.auth.signOut()}
        />
      </HStack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th isNumeric>Sl.No</Th>
              <Th width={500}>Task</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos.map((todo, index) => (
              <Tr key={todo.id}>
                <Td isNumeric>{index + 1}</Td>
                <Td>
                  <Flex justifyContent={'space-between'} alignItems={'center'}>
                    {todo.todo}
                    <IconButton
                      colorScheme="red"
                      aria-label="Search database"
                      icon={<DeleteIcon />}
                      onClick={() => onRemoveTask(todo.id)}
                      hidden={todo.user_id !== user?.id}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Tasks;
