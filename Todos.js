import React, { useState, useEffect }from 'react';
// import { FlatList, Button, View, Text, TextInput } from 'react-native';
import { FlatList, View, Text, Button } from 'react-native';
import Todo from './Todo';

import firestore from '@react-native-firebase/firestore'
import { Appbar, TextInput } from 'react-native-paper';


function Todos() {
  const [ todo, setTodo ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ todos, setTodos ] = useState([]);
  const ref = firestore().collection('todos');


  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }

  useEffect(() => {
    return ref.onSnapshot((querySnapshot) => {
      // TODO
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });

      setTodos(list);

      if (loading) {
        setLoading(false)
      }
    });
  }, []);

  if(loading) {
    return null;
  }

  return (
    <>
      <Appbar>
        <Appbar.Content title={'TODOs List'} />
      </Appbar>
      <FlatList
        style={{flex: 1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Todo {...item} />}
      />
      <TextInput label={'New Todo'} value={todo} onChangeText={setTodo} />
      <Button onPress={() => addTodo()} title='Add TODO' />
    </>
  );
}

export default Todos;