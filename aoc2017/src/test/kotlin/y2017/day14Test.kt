package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import y2017.day14
import y2017.day14Second

class day14Test {
    @Test
    fun test1() {
       assertEquals(8108, day14("flqrgnkx"))
    }

    @Test
    fun testActual() {
        assertEquals(8250, day14("stpzcrnm"))
    }

    @Test
    fun test1Second() {
        assertEquals(1242, day14Second("flqrgnkx"))
    }

    @Test
    fun testActualSecond() {
        assertEquals(1113, day14Second("stpzcrnm"))
    }
}
