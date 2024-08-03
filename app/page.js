'use client';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBVuMYqtxjgdA7NgEhFmIoYWI0ZYJHh1M",
  authDomain: "pantry-track-a6784.firebaseapp.com",
  projectId: "pantry-track-a6784",
  storageBucket: "pantry-track-a6784.appspot.com",
  messagingSenderId: "749369800469",
  appId: "1:749369800469:web:0627d17fbbaab0fefa5b1c",
  measurementId: "G-QSWCBB5SB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={4}
      sx={{
        bgcolor: '#f3f4f6',
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Typography variant="h2" color="primary" mb={4} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Pantry Manager
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleOpen}
        sx={{
          mb: 3,
          bgcolor: '#1976d2',
          '&:hover': {
            bgcolor: '#1565c0',
          },
          width: { xs: '80%', sm: '50%', md: 'auto' },
        }}
      >
        Add New Item
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: '90%', sm: 400 }}
          bgcolor="background.paper"
          borderRadius={1}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6" align="center" color="textSecondary">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              sx={{
                bgcolor: '#fff',
                borderRadius: 1,
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                bgcolor: '#ff4081',
                '&:hover': {
                  bgcolor: '#f50057',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        width={{ xs: '100%', sm: '90%', md: '1000px' }}
        bgcolor="#fff"
        borderRadius={1}
        overflow="auto"
        boxShadow={3}
        sx={{
          marginX: { xs: 2, sm: 0 },
        }}
      >
        <Box
          height="100px"
          bgcolor="#1976d2"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h4" color="common.white" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" spacing={3} p={3}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#e3f2fd"
              padding={3}
              borderRadius={1}
              sx={{
                '&:hover': {
                  bgcolor: '#bbdefb',
                },
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <Typography variant="h5" color="textPrimary" fontWeight="bold" sx={{ mb: { xs: 2, sm: 0 } }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" color="textPrimary" fontWeight="bold" sx={{ mb: { xs: 2, sm: 0 } }}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addItem(name)}
                  sx={{
                    bgcolor: '#64b5f6',
                    '&:hover': {
                      bgcolor: '#42a5f5',
                    },
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                  sx={{
                    bgcolor: '#e57373',
                    '&:hover': {
                      bgcolor: '#ef5350',
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
