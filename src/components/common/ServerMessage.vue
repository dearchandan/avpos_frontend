<template>
    <div v-if="server_messages.messages != ''" class="p-3 rounded" :class="[ (server_messages.type == 'error') ? 'alert alert-danger' : 'alert alert-'+server_messages.type  ]">
        <ul v-for="error in loopServerErrors(server_messages.messages)">
            <li> 
                <i v-if="server_messages.type == 'error'" class="fa fa-exclamation" />
                <i v-if="server_messages.type == 'success'" class="fa fa-check" />
                 {{ error }} 
            </li>
        </ul>
    </div>
</template>

<script setup>

    const { server_messages } = defineProps(['server_messages']);
    
    function loopServerErrors(errors){
      var errors_array = [];
      if(_.isObject(errors)){
        _.forEach( errors, (value,key) => {
          errors_array.push(value[0]);
        }); 
      }else{
        errors_array.push(errors);
      }
      return errors_array;
    }
    

    onMounted(() => {
      server_messages.value = loopServerErrors(server_messages);
    });

</script>